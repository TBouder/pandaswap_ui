/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday July 29th 2021
**	@Filename:				ModalVaultList.js
******************************************************************************/

import	React, {useState, useEffect, Fragment}	from	'react';
import	Image									from	'next/image';
import	{List}									from	'react-virtualized';
import	{ethers}								from	'ethers';
import	{Transition}							from	'@headlessui/react';
import	useAccount								from	'contexts/useAccount';
import	{toAddress}								from	'utils';

function ModalVaultList({vaults, label, value, set_value, disabled}) {
	const	{balancesOf} = useAccount();
	const	[open, set_open] = useState(false);
	const	[filter, set_filter] = useState('');
	const	[filteredVaultList, set_filteredVaultList] = useState(vaults);

	useEffect(() => {
		const	_vaults = vaults.map((v) => {
			v.balanceOf = ethers.utils.formatUnits(balancesOf[v.address]?.toString() || '0', v.decimals);
			return (v);
		}).sort((a, b) => b.balanceOf - a.balanceOf);

		if (filter === '') {
			set_filteredVaultList(_vaults);
		} else {
			set_filteredVaultList((_vaults).filter(e => (
				(e.name).toLowerCase().includes(filter.toLowerCase()) ||
				(e.symbol).toLowerCase().includes(filter.toLowerCase()) ||
				toAddress(e.address).includes(toAddress(filter))
			)));
		}
	}, [filter, vaults, balancesOf]);

	return (
		<div className={'w-full'}>
			<div className={'relative'}>
				<button
					onClick={() => disabled ? null : set_open(true)}
					className={`relative w-full px-4 text-left bg-ygray-100 hover:bg-ygray-50 rounded-lg focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} h-24 py-2`}>
					<div className={'flex flex-row items-center'}>
						<Image
							src={value.icon}
							alt={value?.displayName || value?.name}
							objectFit={'contain'}
							loading={'eager'}
							width={40}
							height={40} />
						<span className={'block truncate ml-2 font-bold text-sm text-gray-800'}>
							{value?.symbol}
						</span>
					</div>
					<span className={'absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'}>
						<svg width={'8'} height={'12'} viewBox={'0 0 8 12'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
							<path fillRule={'evenodd'} clipRule={'evenodd'} d={'M0.185577 0.256131C0.458339 -0.0555956 0.93216 -0.0871836 1.24389 0.185577L7.24388 5.43557C7.40664 5.57798 7.5 5.78373 7.5 6C7.5 6.21627 7.40664 6.42202 7.24388 6.56443L1.24389 11.8144C0.93216 12.0872 0.458339 12.0556 0.185577 11.7439C-0.0871836 11.4321 -0.0555956 10.9583 0.256131 10.6856L5.61106 6L0.256131 1.31444C-0.0555956 1.04168 -0.0871836 0.567858 0.185577 0.256131Z'} fill={'#333333'}/>
						</svg>
					</span>
				</button>
			</div>

			<Transition
				show={open}
				as={Fragment}
				appear={true}
				unmount={false}
				enter={'ease-out duration-200'}
				enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
				enterTo={'opacity-100 translate-y-0 sm:scale-100'}
				leave={'ease-in duration-200'}
				leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
				leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}>
				<div as={'div'} className={'absolute z-50 inset-0 overflow-hidden'}>
					<div className={'flex w-full h-full bg-white p-4 rounded-lg overflow-hidden z-10'}>
						<div className={'inline-block bg-blue-400 rounded-lg w-full f-full z-20'}>
							<div className={'px-6 py-7 relative h-full overflow-hidden'}>
								<div className={'flex flex-row items-center justify-between w-full mb-6'}>
									<svg className={'cursor-pointer'} onClick={() => set_open(false)} width={'24'} height={'24'} viewBox={'0 0 24 24'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
										<path fillRule={'evenodd'} clipRule={'evenodd'} d={'M14.8144 17.7439C14.5417 18.0556 14.0678 18.0872 13.7561 17.8144L7.75612 12.5644C7.59336 12.422 7.5 12.2163 7.5 12C7.5 11.7837 7.59336 11.578 7.75612 11.4356L13.7561 6.18558C14.0678 5.91282 14.5417 5.9444 14.8144 6.25613C15.0872 6.56786 15.0556 7.04168 14.7439 7.31444L9.38894 12L14.7439 16.6856C15.0556 16.9583 15.0872 17.4321 14.8144 17.7439Z'} fill={'white'}/>
									</svg>
									<h3 as={'h3'} className={'text-lg font-medium text-white'}>
										{label}
									</h3>
									<div />
								</div>
								<div className={'py-0.5'}>
									<div className={'w-full rounded-md bg-blue-900 text-lg p-4 relative'}>
										<input
											type={'text'}
											name={'vaultName_or_address'}
											id={'vaultName_or_address'}
											value={filter}
											onChange={(e) => set_filter(e.target.value)}
											placeholder={'Filter or address'}
											style={{backgroundColor: 'transparent', opacity: 1}}
											className={'whitePlaceholder block w-full text-white'} />
										<div className={'absolute right-4 top-0 bottom-0 flex items-center'}>
											<svg width={'24'} height={'24'} viewBox={'0 0 24 24'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
												<path fillRule={'evenodd'} clipRule={'evenodd'} d={'M10 1C5.02972 1 1 5.02972 1 10C1 14.9703 5.02972 19 10 19C12.1249 19 14.0779 18.2635 15.6176 17.0318L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L17.0318 15.6176C18.2635 14.0779 19 12.1249 19 10C19 5.02972 14.9703 1 10 1ZM3 10C3 6.13428 6.13428 3 10 3C13.8657 3 17 6.13428 17 10C17 13.8657 13.8657 17 10 17C6.13428 17 3 13.8657 3 10Z'} fill={'white'}/>
											</svg>
										</div>
									</div>
								</div>
								<div className={'mt-6 h-full '}>
									<div className={'list h-full'}>
										<List
											width={600}
											height={280}
											className={'focus:outline-none pb-2'}
											rowHeight={56}
											rowRenderer={({index, key, style}) => {
												return (
													<div
														onClick={() => {
															set_value(filteredVaultList[index]);
															set_open(false);
														}}
														key={key}
														style={style}
														className={'flex flex-row justify-between hover:bg-white hover:bg-opacity-20 cursor-pointer items-center rounded-lg p-2 pr-4 focus:outline-none'}>
														<div className={'flex flex-row items-center'}>
															<Image
																src={filteredVaultList[index]?.icon || ''}
																alt={filteredVaultList[index]?.displayName || filteredVaultList[index]?.name}
																objectFit={'contain'}
																loading={'eager'}
																width={40}
																height={40} />
															<span className={'content block truncate ml-2 text-white text-ybase font-bold'}>
																{filteredVaultList[index]?.symbol}
															</span>
														</div>
														<span className={'text-white text-ybase font-bold'}>
															{ethers.utils.formatUnits(balancesOf[filteredVaultList[index].address]?.toString() || '0', filteredVaultList[index].decimals)}
														</span>
													</div>
												);
											}}
											rowCount={filteredVaultList.length} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
				
		</div>
	);
}

export default ModalVaultList;